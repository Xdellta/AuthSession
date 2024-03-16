# AuthSession
This project serves an educational purpose, functioning as a backend system designed to handle user authentication through sessions.

### Supported functions
* Login system
* Logout system
* Register system
* Password recovery system
* Session handling system

### Tools
![Express](https://img.shields.io/badge/Express.js-000000?style=for-the-badge&logo=express&logoColor=white)
![NodeJS](https://img.shields.io/badge/node.js-6DA55F?style=for-the-badge&logo=node.js&logoColor=white)
![TypeScript](https://img.shields.io/badge/typescript-%23007ACC.svg?style=for-the-badge&logo=typescript&logoColor=white)
![MySQL](https://img.shields.io/badge/mysql-4479A1.svg?style=for-the-badge&logo=mysql&logoColor=white)
![Prisma](https://img.shields.io/badge/Prisma-3982CE?style=for-the-badge&logo=Prisma&logoColor=white)

### License
[![Licence](https://img.shields.io/github/license/Ileriayo/markdown-badges?style=for-the-badge)](./LICENSE)



## endpoint specification
```sh
/api/login
```
* Request: `email: string`, `password: string`
* Response: set cookie `sessionId`

```sh
/api/logout
```
* Request: get cookie `sessionId`
* Response: clear cookie `sessionId`