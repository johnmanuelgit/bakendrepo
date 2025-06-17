const defaultAdmin = require('../models/defaultAdmin');
const bcrypt =require('bcryptjs');

const initAdmin = async ()=>{
    try{
        const existingadmin = await defaultAdmin.findOne({username:'john'})
        if (!existingadmin) {
const hashedPassword = await bcrypt.hash('john01',10)
      
const defaultAdmins = new defaultAdmin({
 username:'john',
 email: 'sjohnmanuelpc@gmail.com',
 password:hashedPassword,
 role:'superadmin'
});
await defaultAdmins.save()}
else {
      console.log('Default superadmin already exists.');
    }}
catch (err) {
    console.error('Error creating default admin:', err);
  }
};


module.exports = initAdmin;


