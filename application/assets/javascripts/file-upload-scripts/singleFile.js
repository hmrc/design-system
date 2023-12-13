if (document.readyState === "loading") {
  // Loading hasn't finished yet
  document.addEventListener("DOMContentLoaded", fileUploadSetUp);
} else {
  fileUploadSetUp();
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
        window.location.assign("../single-file/2-uploading.html");
    }
  }
  else if (errorExecuted && fileSelected) {
      window.location.assign("../single-file/2-uploading.html");
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
uploadAFileBtn.addEventListener('click', (event)=> {
  event.preventDefault();
  selectAFile();
});

// mostly works but an issue where the status information is displaying the html as it accesses the summary list information to get the status information name

function fileUploadingError() {
    if (!fileUploaded) {
    const summaryListParent = document.querySelector('.govuk-summary-list__key');
    summaryListParent.innerHTML = `<div class="govuk-form-group govuk-form-group--error">fileNumber1.jpg<p id="not-uploaded-error" class="govuk-error-message">
    <span class="govuk-visually-hidden">Error:</span> The selected file has not fully uploaded</p></div>`;
  }
    else if (fileUploaded) {
    window.location.assign("../../js-version/index.html");
  }
  else {
    console.log('unknown error...');
  }
}

function fileUploadingEventListener() {
  const uploadingContinueBtn = document.querySelector('.govuk-button');
  uploadingContinueBtn.addEventListener('click', (uploadEvent)=> {
    uploadEvent.preventDefault();
    fileUploadingError();
  });
}

function fileUploadSetUp() {
  document.querySelector('#refreshText').remove();
  const initialStatusInformation = document.querySelector('#statusInformation');
  initialStatusInformation.textContent = `fileNumber1.jpg is uploading`;

  fileUploadingEventListener();

  const fileUploadTimeToComplete = Date.now() + 2000;
  poll(function () {

    return Date.now() >= fileUploadTimeToComplete;
  }, 200000, 150).then(()=> {
    fileUploaded = true;
    const govukSummaryList = document.querySelector('#uploadingList');
    const fileStatus = govukSummaryList.querySelector('.govuk-tag');
    const fileNameEl = govukSummaryList.querySelector('.govuk-summary-list__key');
    const statusInformation = document.querySelector('#statusInformation');
    fileNameElText = fileNameEl.innerHTML;
    newFileNameElHtml = `<a href="#" class="govuk-link">${fileNameElText}</a>`;
    fileNameEl.innerHTML = newFileNameElHtml;
    fileStatus.textContent = 'uploaded';
    fileStatus.classList.remove('govuk-tag--yellow');
    fileStatus.classList.add('govuk-tag--green');
    statusInformation.textContent = `${fileNameElText} has been ${fileStatus.textContent}`;
  }).catch(function () {
    console.error(`Poll timed out, Time now: ${Date.now()}, Wait time: ${document.querySelector('#uploadingList').dataset.waitTime}`);
  });
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
