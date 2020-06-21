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

## Level-4  
### Salting & Bcrypt  
In order to make a hash more secure a random seuence of characters is added in the end called as the salt. To enhnace the security multiple time this process is done which is referred as salt rounds. Also, MD5 hash function is little easy to decrypt so we use Bcrypt. A computer with highest GPU can only generate 17000 Hash/sec of Bcrypt function.  
Commit Key : 559c8ad9bd3d26a35a53fcefd37c4e25050bc418  

## Level-5  
### Cookies & Sessions using Passport JS  
It very crucial that the users are authenticated using a proper method and also once logged in the user are able to view the webpage until unless they close logout ( if tabs are closed accidently the data should be retained). To do this we use the Passport JS with other packages like sessions, passport-local-mongoose.  
Commit Key : b21c711eeb2621c1c8afb696d242b3bd38304fe7  



