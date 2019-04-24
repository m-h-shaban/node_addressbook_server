const firebase = require("firebase");
const auth = firebase.auth();
const uuid = require('uuid');

const {
    validate,
    validationResult,
    errorFormatter
} = require("../validation/addressbook.validation");
exports.validate = validate;

const { BUCKET_NAME, bucket, storage} = require('../config/firebase_storage')


const uploadImageToStorage = (file, image_name) => {
    return new Promise(async(resolve, reject) => {
        if (!file) {
            reject('No image file');
        }
        // let newFileName = `${file.name}`;
        let newFileName = image_name;

        let fileUpload = bucket.file(newFileName);

        const blobStream = fileUpload.createWriteStream({
            metadata: {
                // contentType: file.mimetype
                contentType: 'image/jpeg'
            },
            resumable: false
        });

        blobStream.on('error', (error) => {
            reject('Something is wrong! Unable to upload at the moment.');
        });

        blobStream.on('finish', () => {
            // The public URL can be used to directly access the file via HTTP.
            fileUpload.makePublic()
            const url = `https://storage.googleapis.com/${bucket.name}/${fileUpload.name}`;
            resolve(url);
        });

        buffer = file.data;
        blobStream.end(buffer);

    });
}

exports.delete = async (req, res) => {
    try {        
        ref = await firebase
        .database()
        .ref("data")
        .child(auth.currentUser.uid)
        .child(req.params.key);

        image_name = '';

        await ref.once("value", async function(snapshot) {
              addressbook_snapshot = snapshot.val();
              image_name = addressbook_snapshot.image_name;
          });

        await storage
            .bucket(BUCKET_NAME)
            .file(image_name)
            .delete();

        ref.remove();
    
        res.status(200).json({ message: 'Addressbook deleted successfully' });
    } catch (error) {
      res.status(500).json({ errors: { error: error.message } });
    }
}

exports.update = async (req, res) => {
    try {
        errors = validationResult(req).formatWith(errorFormatter);

        if (!errors.isEmpty()) {
        return res.status(400).json({ errors: errors.mapped() });
        }
        
        ref = await firebase
        .database()
        .ref("data")
        .child(auth.currentUser.uid)
        .child(req.params.key);

        image_name = '';

        date_created = '';

        await ref.once("value", async function(snapshot) {
              addressbook_snapshot = snapshot.val();
              image_name = addressbook_snapshot.image_name;
              date_created = addressbook_snapshot.date_created;
          });

        await storage
            .bucket(BUCKET_NAME)
            .file(image_name)
            .delete();

        file = req.files.file;

        url = '';
        let newFileName = `${uuid.v4()}.jpg`;

        
        if (file) {
            url = await uploadImageToStorage(file, newFileName)
        }
        
        address_book = {
            name:req.body.name,
            age: req.body.age,
            bio: req.body.bio,
            country: req.body.country,
            city:req.body.city,
            address: req.body.address,
            building_number: req.body.building_number,
            postal_code: req.body.postal_code,
            image: url,
            image_name: newFileName,
            date_created: date_created
        }

        ref = await firebase
        .database()
        .ref("data")
        .child(auth.currentUser.uid)
        .child(req.params.key);

        await ref.set(address_book);
    
        res.status(200).json({ address_book: address_book, message: 'Address Book updated successfully' });
    } catch (error) {
      res.status(500).json({ errors: { error: error.message } });
    }
}

exports.create = async (req, res) => {
    try {
        errors = validationResult(req).formatWith(errorFormatter);

        if (!errors.isEmpty()) {
        return res.status(400).json({ errors: errors.mapped() });
        }
        
        file = req.files.file;

        url = '';
        let newFileName = `${uuid.v4()}.jpg`;
        
        if (file) {
            url = await uploadImageToStorage(file, newFileName)
        }
        
        address_book = {
            name:req.body.name,
            age: req.body.age,
            bio: req.body.bio,
            country: req.body.country,
            city:req.body.city,
            address: req.body.address,
            building_number: req.body.building_number,
            postal_code: req.body.postal_code,
            image: url,
            image_name: newFileName,
            date_created: Date.now()
        }

        ref = await firebase
        .database()
        .ref("data")
        .child(auth.currentUser.uid);

        await ref.push(address_book);
    
        res.status(200).json({ address_book: address_book, message: 'New Address Book added in successfully' });
    } catch (error) {
      res.status(500).json({ errors: { error: error.message } });
    }
  };

exports.get = async (req, res)=> {
    try {
        
        ref = await firebase
        .database()
        .ref("data")
        .child(auth.currentUser.uid)
        .child(req.params.key);

        await ref.once("value", async function(snapshot) {
            address = snapshot.val();
            res.status(200).json({ address: address });
        });    
        
    } catch (error) {
      res.status(500).json({ errors: { error: error.message } });
    }
}

exports.get_all = async (req, res)=>{
    try {
        
        ref = await firebase
        .database()
        .ref("data")
        .child(auth.currentUser.uid);
        
        await ref.orderByChild('date_created').once("value", async function(snapshot) {
            // addresses = snapshot.val();
            var addresses = [];

            snapshot.forEach(function(childSnapshot) {
                var item = childSnapshot.val();
                item.key = childSnapshot.key;
                
                addresses.push(item);
            });

            res.status(200).json({ addresses: addresses.reverse() });
        });
    
        
    } catch (error) {
      res.status(500).json({ errors: { error: error.message } });
    }
}