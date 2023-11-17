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
  
  uploadAnotherReceiptButton.addEventListener("click", ()=> {
    uploadAnotherReceiptButton.remove();
    const ariaLiveContainer = document.querySelector('#ariaLiveContainer');
    const fileUploadHTML = `<div class="govuk-form-group"><input class="govuk-file-upload" id="file-upload-1" name="fileUpload1" type="file"></div>`
    ariaLiveContainer.innerHTML = fileUploadHTML;
    const fileUploadEl = document.querySelector('.govuk-file-upload');
    fileUploadEl.addEventListener('change', addAdditionalRow);
  });
}

function removeFileSetup() {
  const allRows = document.querySelectorAll('.govuk-summary-list__row .govuk-link');
  allRows.forEach((removeButton)=> {
    const row = removeButton.parentNode.parentNode;
    removeButton.addEventListener('click', ()=> {row.parentNode.removeChild(row)});
  });
}

function pageLoad() {
  fileUploadSetUp();
  handleFileUploadButton();
  removeFileSetup();

}
function fileUploadSetUp() {

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
};

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
