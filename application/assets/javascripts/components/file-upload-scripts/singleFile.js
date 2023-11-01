window.GOVUKPrototypeKit = {
  majorVersion: 13,
  documentReady: (fn) => {
    if (document.readyState !== 'loading') {
      // IE9 support
      fn()
    } else {
      // Everything else
      document.addEventListener('DOMContentLoaded', fn)
    }
  },
  internal: {}
}

window.GOVUKPrototypeKit.documentReady(() => {
  document.querySelector('#refreshText').remove();

  poll(function () {
    return Date.now() >= document.querySelector('#uploadingList').dataset.waitTime;
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
});

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
