<!-- Readme top -->
<a name="readme-top"></a>

<h1 align="center">PROYEK TUGAS AKHIR</h1>
<h3 align="center">Implementasi MERN RESTful API Aplikasi Penilaian Hasil Test of Second Mathematics PT. Exa Connect Indonesia Berbasis Web </h3>
<h4 align="center"> Tech Stack 🖥️ : MongoDB Atlas (Mongoose), ExpressJS, ReactJS, NodeJS.<br></br>

![MongoDB](https://img.shields.io/badge/MongoDB-%234ea94b.svg?style=flat-square&logo=mongodb&logoColor=white)
![Express.js](https://img.shields.io/badge/express.js-%23404d59.svg?style=flat-square&logo=express&logoColor=%2361DAFB)
![React](https://img.shields.io/badge/React.js-badge?style=flat-square&logo=react&labelColor=1B1B1B&color=22BBEE)
![NodeJS](https://img.shields.io/badge/node.js-6DA55F?style=flat-square&logo=node.js&logoColor=white)
![JavaScript](https://img.shields.io/badge/javascript-%23323330.svg?style=flat-square&logo=javascript&logoColor=%23F7DF1E)

</h4>

#

[![badge][love-badge]][url-ig]
[![MIT License][license-badge]][license-url]

## 📌Table of Contents

- [Introduction](#introduction)
- [Tutorial](#tutorial)
- [Installation](#installation)
- [Usage](#usage)
- [API Documentation](#api-documentation)
  - [API Students](#api-students)
  - [API Test Results](#api-test-results)
  - [API Import Excel](#api-import-excel)
- [Contributing](#contributing)
- [License](#license)

## Introduction

This project is a backend API for managing students and their test results. Built with Node.js, it provides endpoints to create, read, update, and delete students and test results.

Belajar Membuat Implementasi RESTful API menggunakan NodeJS, Express.

Proyek MERN ini akan terus berlanjut sebagai media pembelajaran khususnya untuk diri saya sendiri sebelum tiba saatnya sampai di fase 
_`"temanku berkata: Iki ono garapan"`_

## 🚀Tutorial

<h4 align="center">
ِبِسْمِ اللَّهِ الرَّحْمَنِ الرَّحِيْم
</h4>

🛠️ Tools :
* Teks Editor </>  : 
  - Visual Studio Code, etc.
* Pengujian API 🔥:
  - Postman.
  - HTTPie.
  - ThunderClient (VS Code Extension).

Perlu disiapkan :

1. Buat Akun MongoDB Atlas beserta database (nama database bebas).
2. Masuk ke menu `Database > Connect > [Driver: (Mongoose), Version: Stable API] > Copy Connection String :`
    ```bash
    mongodb+srv://<username>:<password>@<database>.xlflmda.mongodb.net/
    ```
3. Buat file `.env` yang berisi :
    ```bash
    DB_URI : "ENTER YOUR CONNECTION STRING"
    PORT   :  5000
    ```
4. Setelah semua sudah disiapkan lanjut ke 👇

## Installation

To install the dependencies, run the following command:

```bash
npm install
```

## Usage

To start the server, run the following command:

```markdown
npm run dev
```

## 🔥API Documentation


### 🎓API Students

|HTTP Method    |Endpoint  | Description  |Body Parameters  | 
| -----------   | ---------| ---------    | --------------- |
|POST   |/students          |Create a new student           |`{ "name": "string", "kelas": "string" }`|
|GET    |/students          |Read all students              |- |
|GET    |/students/:id      |Read a student by ID           |- |
|PUT    |/student/:id       |Update a student by ID         |`{ "name": "string", "kelas": "string" }`|
|DELETE |/student/:id       |Delete a student by ID         |- |
|POST   |/students/multi    |Delete multiple students by IDs|`{ "ids": ["string","string","string"] }`|

### 📝API Test Results

| HTTP Method | Endpoint         | Description | BodyParameters |
| ----------- | --------         | ----------- | ------------   |
| POST| /test-result| Create a new test result| `{ "nama": "string","kelas": "string", "opm_tambah": "number","opm_kurang":"number", "opm_kali": "number", "opm_bagi": "number" }` |
| GET         | /test-result     | Read all test results      | - |
| GET         | /test-result/:id | Read a test result by ID   | - |
| PUT         | /test-result/:id | Update a test result by ID | `{ "opm_tambah": "number", "opm_kurang": "number", "opm_kali": "number", "opm_bagi": "number" }`|
| DELETE      | /test-result/:id | Delete a test result by ID | - |
| POST        | /test-result/multi | Delete multiple test results by IDs | `{ "ids": ["string","string","string"] }` |


### 📄API Import Excel

| HTTP Method | Endpoint  | Description        | BodyParameters     |
| ----------- | --------  | -----------        | ------------       |
|POST         | /import   | Import file Excel  | `{"files/xlsx"}`   |

* Struktur file Excel

  | Nama    | Kelas         | OPM Tambah | OPM Kurang | OPM Kali |  OPM Bagi |
  | ---     | --------      | -----------| -----------| -----    | -----     |
  |John Doe | Universitas X | `100.12`   | `90.34`    | `80.56`  |  `70.78`  |

## Contributing

Contributions are welcome! Please fork the repository and submit a pull request for any bugs, feature requests, or improvements. Any contributions you make are greatly appreciated.

If you have a suggestion that would make this better, please fork the repo and create a pull request. You can also simply open an issue with the tag "enhancement". Don't forget to give the project a star! Thanks again!

1. Fork the Project
2. Create your Feature Branch (`git checkout -b feature/AmazingFeature`)
3. Commit your Changes (`git commit -m 'Add some AmazingFeature'`)
4. Push to the Branch (`git push origin feature/AmazingFeature`)
5. Open a Pull Request

## License

This project is licensed under the MIT License. See the [LICENSE](LICENSE) file for details.

<h4 align="right">
<p align="right"><a href="#readme-top">Back to top ▲</a></p>
</h4>

<!-- MARKDOWN LINKS & IMAGES -->
[love-badge]:https://img.shields.io/badge/build_with-%F0%9F%92%96-FDA1F9?style=for-the-badge&labelColor=%23FC88F3
[url-ig]:https://instagram.com/toti.k.w
[license-badge]:https://img.shields.io/badge/license-MIT-badge?style=for-the-badge&labelColor=9BFADE&color=B4FADA
[license-url]:https://github.com/TotiKresna/backend-simmd/blob/main/LICENSE
