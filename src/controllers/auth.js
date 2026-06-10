import bcrypt from 'bcryptjs';
import { getAllUsers, getUserByEmail, createUser } from '../models/users.js';

const showRegisterForm = (req, res) => {
  const title = 'Register';
  res.render('register', { title });
};

const processRegister = async (req, res) => {
  const { name, email, password, confirmPassword } = req.body;

  if (!name || !email || !password || !confirmPassword) {
    req.flash('error', 'Name, email, and password are required.');
    return res.redirect('/register');
  }

  if (password !== confirmPassword) {
    req.flash('error', 'Passwords do not match.');
    return res.redirect('/register');
  }

  const normalizedEmail = email.trim().toLowerCase();
  const existingUser = await getUserByEmail(normalizedEmail);

  if (existingUser) {
    req.flash('error', 'An account with that email already exists.');
    return res.redirect('/register');
  }

  const passwordHash = await bcrypt.hash(password, 10);

  await createUser({
    name: name.trim(),
    email: normalizedEmail,
    passwordHash,
    role: 'user'
  });

  req.flash('success', 'Registration successful. Please log in.');
  res.redirect('/login');
};

const showLoginForm = (req, res) => {
  const title = 'Login';
  res.render('login', { title });
};

const processLogin = async (req, res) => {
  const { email, password } = req.body;

  if (!email || !password) {
    req.flash('error', 'Email and password are required.');
    return res.redirect('/login');
  }

  const normalizedEmail = email.trim().toLowerCase();
  const user = await getUserByEmail(normalizedEmail);

  if (!user) {
    req.flash('error', 'Invalid email or password.');
    return res.redirect('/login');
  }

  const passwordMatches = await bcrypt.compare(password, user.password_hash);

  if (!passwordMatches) {
    req.flash('error', 'Invalid email or password.');
    return res.redirect('/login');
  }

  req.session.user = {
    id: user.user_id,
    name: user.name,
    email: user.email,
    role: user.role
  };

  req.flash('success', `Welcome back, ${user.name}!`);
  res.redirect('/');
};

const logout = (req, res) => {
  req.session.user = null;
  req.flash('success', 'You have been logged out.');
  res.redirect('/');
};

const showUsersPage = async (req, res) => {
  const users = await getAllUsers();
  const title = 'Registered Users';

  res.render('users', { title, users });
};

export { showRegisterForm, processRegister, showLoginForm, processLogin, logout, showUsersPage };