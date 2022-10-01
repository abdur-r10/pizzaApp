# pizzaApp
<pre>
A MERN (MongoDB, Express.js, React.js, Node.js) stack based pizza website

Some features of the website are:
-create account where password has to meet certain criterias to ensure password is strong
-once account is created user details are stored in db, where the password is hashed beforehand
-after creating account a verification link is sent to email address (to ensure email does exist)
-verification link sends you to log in page where user can log in (uses JSON Web Token which is stored as httpOnly cookie in frontend)
-stripe integrated payment page


Also includes a REST API which handles:
-adding items to basket
-increasing quantity of an item in basket
-deleting items from basket
-deleting an order
-placing an order
-updating delivery status
</pre>
