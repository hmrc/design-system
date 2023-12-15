if (document.readyState === "loading") {
  // Loading hasn't finished yet
  document.addEventListener("DOMContentLoaded", fileUploadSetUp);
} else {
  fileUploadSetUp();
}
function fileTypeSelection(selectedDocument) {
  console.log('file type function');
  
  switch(selectedDocument) {
    case 'declaration':
      window.location.assign("../file-types/2-type-question-declaration.html");
      break;
    case 'invoice':
      window.location.assign("../file-types/2-type-question-invoice.html");
      break;
    case 'receipt':
      window.location.assign("../file-types/2-type-question-receipt.html");
      break;
  }
}

  function fileUploadSetUp() {
  //document.querySelector('#refreshText').remove();

  // selected file event listeners
  var selectedDocument = '';
  document.querySelector('#want-to-register').addEventListener('change', ()=> {
    selectedDocument = 'declaration';
  })
  document.querySelector('#want-to-register-2').addEventListener('change', ()=> {
    selectedDocument = 'invoice';
  })
  document.querySelector('#want-to-register-3').addEventListener('change', ()=> {
    selectedDocument = 'receipt';
  })

  const btn = document.querySelector('.govuk-button');
  console.log(btn);
  btn.addEventListener('click', (continueEvent)=> {
    continueEvent.preventDefault();
    fileTypeSelection(selectedDocument);
  });

  const fileUploadTimeToComplete = Date.now() + 2000;

  poll(()=> {

    return Date.now() >= fileUploadTimeToComplete;
  }, 200000, 150).then(function () {

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
