# Authentication-Security
Learning about different levels of security a web page can have. 

## Level-1 
### Username and Password  
Every User will have access to webpage **secrets** only when his email and password are valid.  
Commit Key : 7724fd758d3803f8c57d91ed7dda68f2745d44ce  

## Level-2 
### Database Encryption  
At Level-1 the admin was able to view the passwords of users. So mongoose-encryption is used to encrypt the password field.  
Commit Key : 9de5dce4c810512e4afe58a142a7748d6ef8bee2

## Level-3 
### Hashing
To encrypt we are using a string named secret. If someone gets it, the password will be decrypted. So to avoid that we use Hashing. A MD5 hash is been use to hash the password and store it.  
Commit Key : 936c12ca72a2034bfe6aa4fc033c662ee1606f1e  
