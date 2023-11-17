//
// For guidance on how to create routes see:
// https://prototype-kit.service.gov.uk/docs/create-routes
//

const govukPrototypeKit = require('govuk-prototype-kit')
const router = govukPrototypeKit.requests.setupRouter()

// JS files toggle

router.get('/disable-js', function (req, res) {
  req.session.data['no-in-page-js'] = true;
  res.locals.data['no-in-page-js'] = true;

  res.redirect('/');
});

router.get('/enable-js', function (req, res) {
  req.session.data['no-in-page-js'] = false;
  res.locals.data['no-in-page-js'] = false;

  res.redirect('/');
});

// Single file

router.post('/single-file/1-upload-a-single-file', function (req, res) {
  const now = Date.now();
  const waitTime = now + 5000;

  req.session.data['wait-time'] = waitTime;

  res.redirect('/single-file/2-uploading.html');
});

router.get('/single-file/2-uploading', function (req, res) {
  if (Date.now() >= req.session.data['wait-time']) {
    res.redirect('/single-file/3-uploaded.html');
  } else {
    res.render('single-file/2-uploading');
  }
});

router.post('/single-file/2-uploading', function (req, res) {
  res.redirect('/single-file/3-uploaded.html');
});

// Multiple files

router.post('/multiple-files/1-upload-a-single-file', function (req, res) {
  function getRandomInt(min, max) {
    min = Math.ceil(min);
    max = Math.floor(max);
    return Math.floor(Math.random() * (max - min) + min); // The maximum is exclusive and the minimum is inclusive
  }

  const now = Date.now();
  const waitTime = now + getRandomInt(30000, 32000);

  if (!req.session.data.files){
    req.session.data.files = [];
  }

  req.session.data.files.push({'filename': req.session.data['file-upload-1'], 'wait-time': waitTime});

  res.redirect('/multiple-files/2-upload-additional-files.html');
});

router.get('/multiple-files/2-upload-additional-files', function(req, res) {
  req.session.data.now = Date.now();

  if(req.session.data.files) {
    req.session.data.completed = req.session.data.files.filter(file => file['wait-time'] <= Date.now()).length;
    req.session.data.total = req.session.data.files.length;
  }
  if(res.locals.data.files) {
    res.locals.data.completed = req.session.data.files.filter(file => file['wait-time'] <= Date.now()).length;
    res.locals.data.total = req.session.data.files.length;
  }

  res.render('multiple-files/2-upload-additional-files.html');
})
