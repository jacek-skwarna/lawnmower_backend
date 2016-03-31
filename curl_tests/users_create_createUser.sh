curl \
--header "Content-type: application/json" \
--request POST \
--data '{"email": "jacek.skwarna@blstream.com", "password": "test", "gender": "m"}' \
localhost:8080/users/create?_dc=1379027286060