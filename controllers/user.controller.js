const firebase = require("firebase");
// const firebase_config = require("../config/firebase");
// firebase.initializeApp(firebase_config);
const auth = firebase.auth();

const {
  validate,
  validationResult,
  errorFormatter
} = require("../validation/user.validation");
exports.validate = validate;


exports.loginWithGmail = async (req, res) => {
  try {
    var credential = firebase.auth.GoogleAuthProvider.credential(req.body.id_token);
    user = await auth.signInAndRetrieveDataWithCredential(credential);

    res.status(200).json({ user: user, message: 'User logged in successfully' });
  } catch (error) {
    res.status(500).json({ errors: { error: error.message } });
  }
};

exports.loginWithEmailAndPassword = async (req, res) => {
  try {
    errors = validationResult(req).formatWith(errorFormatter);

    if (!errors.isEmpty()) {
      return res.status(400).json({ errors: errors.mapped() });
    }

    email = req.body.email;
    password = req.body.password;

    user = await auth.signInWithEmailAndPassword(email, password);
    res.status(200).json({ user: user, message: 'User logged in successfully' });
  } catch (error) {
    res.status(500).json({ errors: { error: error.message } });
  }
};

exports.loginWithUserNameAndPassword = async (req, res) => {
  try {
    errors = validationResult(req).formatWith(errorFormatter);

    if (!errors.isEmpty()) {
      return res.status(400).json({ errors: errors.mapped() });
    }

    user_name = req.body.user_name;
    password = req.body.password;

    ref = await firebase
      .database()
      .ref("users")
      .child(user_name);

    await ref.once("value", async function(snapshot) {
      if (snapshot.hasChild("email")) {
        user_snapshot = snapshot.val();
        email = user_snapshot.email;
        user = await auth.signInWithEmailAndPassword(email, password);
        return res.status(200).json({ user: user, message: 'User logged in successfully' });
      } else {
        return res
          .status(401)
          .json({ message: `User not found with user name: ${user_name}` });
      }
    });
  } catch (error) {
    res.status(500).json({ errors: { error: error.message } });
  }
};

exports.logout = async (req, res)=>{
  try {
    await auth.signOut();
    res.status(200).json({message: 'User logged out successfully' });
  } catch (error) {
    res.status(500).json({ errors: { error: error.message } });
  }
}

exports.current_user = async (req, res)=>{
  try {
    user = await auth.currentUser;
    res.status(200).json({user: user});
  } catch (error) {
    res.status(500).json({ errors: { error: error.message } });
  }
}

exports.registerWithEmailAndPassword = async (req, res) => {
  try {
    errors = validationResult(req).formatWith(errorFormatter);

    if (!errors.isEmpty()) {
      return res.status(400).json({ errors: errors.mapped() });
    }

    email = req.body.email;
    password = req.body.password;
    user_name = req.body.user_name;

    ref = await firebase
      .database()
      .ref("users")
      .child(user_name);

    await ref.once("value", async function(snapshot) {
      if (snapshot.hasChild("email")) {
        res.status(500).json({ errors: { error: "User name is already in use by another account" } });
      }
    });

    user = await auth.createUserWithEmailAndPassword(email, password);

    auth.onAuthStateChanged(async function(user) {
      if (user) {
        await user.updateProfile({
          displayName: user_name
        });
        await firebase
          .database()
          .ref("users")
          .child(user_name)
          .set({
            uid: user.uid,
            email: email
          });
        res.status(200).json({ user: user, message: 'New user created successfully' });
      }
    });
  } catch (error) {
    res.status(500).json({ errors: { error: error.message } });
  }
};
