const googleStorage = require('@google-cloud/storage').Storage;

var storage = new googleStorage({
    projectId: 'address-book-6763b',
    keyFilename: 'address-book-fc6ac4acb326.json'
})

var BUCKET_NAME = 'address-book-6763b.appspot.com'
var bucket = storage.bucket(BUCKET_NAME)

module.exports = {
    BUCKET_NAME,
    bucket,
    storage
}