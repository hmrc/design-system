if (document.readyState === "loading") {
  // Loading hasn't finished yet
  document.addEventListener("DOMContentLoaded", pageLoad);
} else {
  pageLoad();
}

function addAdditionalRow() {
  const rowHTML = String(`
  <div class="govuk-summary-list__row">
    <dt class="govuk-summary-list__key">
      <a href="#" class="govuk-link">placeholder</a>
    </dt>
    <dd class="govuk-summary-list__value">
      <strong class="govuk-tag govuk-tag--green">uploaded</strong>
    </dd>
    <dd class="govuk-summary-list__actions">
      <a class="govuk-link file1" href="javascript:removeFileSetup()">Remove
        <span class="govuk-visually-hidden"> fileNumber1.jpg</span>
      </a>
    </dd>
  </div>`);

  // inserting row HTML
  const summaryListContainer = document.querySelector('.govuk-summary-list.govuk-summary-list--long-key');
  summaryListContainer.insertAdjacentHTML('beforeend', rowHTML);
  // accessing and changing name of added file
  const numberOfFiles = summaryListContainer.querySelectorAll('.govuk-summary-list__row').length;
  summaryListContainer.lastChild.querySelector('.govuk-link').textContent = 'fileNumber' + String(numberOfFiles) + '.jpg';
}

function handleFileUploadButton() {
  var uploadAnotherReceiptButton = document.querySelector('#uploadAnotherReceiptButton');
  
  uploadAnotherReceiptButton.addEventListener("click", (buttonChangeEvent)=> {
    buttonChangeEvent.preventDefault();
    uploadAnotherReceiptButton.remove();
    const ariaLiveContainer = document.querySelector('#ariaLiveContainer');
    const fileUploadHTML = `<div class="govuk-form-group"><input class="govuk-file-upload" id="file-upload-1" name="fileUpload1" type="file"></div>`
    ariaLiveContainer.innerHTML = fileUploadHTML;
    const fileUploadEl = document.querySelector('.govuk-file-upload');
    fileUploadEl.addEventListener('change', addAdditionalRow);
  });
}

function statusInformationSetUp() {
  const statusInformationDiv = document.querySelector('#statusInformation');
  statusInformationDiv.classList.remove('govuk-visually-hidden');
  statusInformationDiv.classList.add('govuk-hint');

  console.log(statusInformatonDiv);
}

function removeFileSetup() {
  const allRows = document.querySelectorAll('.govuk-summary-list__row .govuk-link');
  allRows.forEach((removeButton)=> {
    const row = removeButton.parentNode.parentNode;
    removeButton.addEventListener('click', ()=> {row.parentNode.removeChild(row)});
  });
}

function selectAFileError() {
  fileUploadEl.remove();
  const adjacentChildHint = document.querySelector('#file-upload-1-hint');
  adjacentChildHint.insertAdjacentHTML('afterend', `<div class="govuk-form-group govuk-form-group--error">
  <label class="govuk-label govuk-!-font-weight-bold" for="select-error">
    fileNumber1.jpg
  </label>
  <p id="select-error-error" class="govuk-error-message">
    <span class="govuk-visually-hidden">Error:</span> Select a file
  </p>
  <input class="govuk-file-upload govuk-file-upload--error" id="select-error" name="select-error" type="file" aria-describedby="select-error-error">
  </div>`);
  // once original fileUploadEl is removed the previous change eventListener becomes redundant so defined a new eventListener
  const newFileUploadEl = document.querySelector('input');
  newFileUploadEl.addEventListener('change', ()=> {fileSelected = true});
}

// on 'continue' button click this function is executed
function selectAFile() {
  if (!errorExecuted) {
    if (!fileSelected) {
      selectAFileError();
      errorExecuted = true;
    }
    else if (fileSelected) {
        window.location.assign("../multiple-files/2-upload-additional-files.html");
    }
  }
  else if (errorExecuted && fileSelected) {
      window.location.assign("../multiple-files/2-upload-additional-files.html");
  }
  else {
    console.log('unknown error...');
  }
}

// select a file error set up
var fileSelected = false;
var errorExecuted = false;
var fileUploaded = false;
const uploadAFileBtn = document.querySelector('.govuk-button');
const fileUploadEl = document.querySelector('input');
fileUploadEl.addEventListener('change', ()=> {fileSelected = true});
uploadAFileBtn.addEventListener('click', (selectAFileEvent)=> {
  selectAFileEvent.preventDefault();
  selectAFile();
});

function fileUploadingError() {
  const uploadedArray = Array.from(document.querySelectorAll('.govuk-tag.govuk-tag--green'));
  if(uploadedArray.length === 4) {
    window.location.assign("../../js-version/index.html");
  }
  else if (uploadedArray.length < 4) {
    const allRows = Array.from(document.querySelectorAll('.govuk-summary-list__row'));
    allRows.forEach((row)=> {
      if(Array.from(row.querySelectorAll('.govuk-tag.govuk-tag--yellow')).length === 1) {
        const summaryListParent = row.querySelector('.govuk-summary-list__key');
        summaryListParent.innerHTML = `<div class="govuk-form-group govuk-form-group--error">fileNumber`+ Number((allRows.indexOf(row))+1) + `.jpg<p id="not-uploaded-error" class="govuk-error-message">
        <span class="govuk-visually-hidden">Error:</span> The selected file has not fully uploaded</p></div>`;
      }
      else if(Array.from(row.querySelectorAll('.govuk-tag.govuk-tag--yellow')).length === 0) {
        console.log('file ' + Number((allRows.indexOf(row))+1) + ' has uploaded');
        const summaryListParent = row.querySelector('.govuk-summary-list__key');
        summaryListParent.innerHTML = `<a href="#" class="govuk-link">fileNumber`+ Number((allRows.indexOf(row))+1) + `.jpg</a>`;
      }
      else {
        alert('forEach unknown error');
      }
    });
  }
  else {
    alert('unknown error...');
  }
}

function fileUploadingEventListener() {
  const uploadingContinueBtn = document.querySelector('.govuk-button.continue');
  uploadingContinueBtn.addEventListener('click', (uploadEvent)=> {
    uploadEvent.preventDefault();
    fileUploadingError();
    console.log('event listener working');
  });
}

function pageLoad() {
  fileUploadSetUp();
  handleFileUploadButton();
  removeFileSetup();
  statusInformationSetUp();
}

function fileUploadSetUp() {
  fileUploadingEventListener();
  function getRandomInt(min, max) {
    min = Math.ceil(min);
    max = Math.floor(max);
    return Math.floor(Math.random() * (max - min) + min); // The maximum is exclusive and the minimum is inclusive
  }

  document.querySelector('#refreshText').remove();
  var rows = document.querySelectorAll('.govuk-summary-list__row');
  rows.forEach(element => {
    uploads(element);
  });

  function uploads(el) {
    const fileUploadTimeToComplete = Date.now() + getRandomInt(2000, 10000);

    poll(function () {
      return Date.now() >= fileUploadTimeToComplete;
    }, 200000, 150).then(function () {
      const fileStatus = el.querySelector('.govuk-tag');
      const fileNameEl = el.querySelector('.govuk-summary-list__key');
      const statusInformation = document.querySelector('#statusInformation');

      fileNameElText = fileNameEl.innerHTML;

      newFileNameElHtml = `<a href="#" class="govuk-link">${fileNameElText}</a>`;
      fileNameEl.innerHTML = newFileNameElHtml;

      fileStatus.textContent = 'uploaded';
      fileStatus.classList.remove('govuk-tag--yellow');
      fileStatus.classList.add('govuk-tag--green');

      const uploadedAmount = document.querySelectorAll('.govuk-tag--green').length;

      statusInformation.innerHTML = `${uploadedAmount} of ${rows.length} files uploaded.`;
    }).catch(function () {
      console.error(`Poll timed out, Time now: ${Date.now()}, Wait time: ${document.querySelector('#uploadingList').dataset.waitTime}`);
    });
  }
}

// The polling function
function poll(fn, timeout, interval) {
  var endTime = Number(new Date()) + (timeout || 2000);
  interval = interval || 100;

  var checkCondition = function (resolve, reject) {
    // If the condition is met, we're done!
    var result = fn();
    if (result) {
      resolve(result);
    }
    // If the condition isn't met but the timeout hasn't elapsed, go again
    else if (Number(new Date()) < endTime) {
      setTimeout(checkCondition, interval, resolve, reject);
    }
    // Didn't match and too much time, reject!
    else {
      reject(new Error('timed out for ' + fn + ': ' + arguments));
    }
  };

  return new Promise(checkCondition);
}