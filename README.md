[![Contributors][contributors-shield]][contributors-url]
[![Issues][issues-shield]][issues-url]
[![MIT License][license-shield]][license-url]

<!-- PROJECT LOGO -->
<br />
<p align="center">
  <h3 align="center">BagBytes</h3>

  <p align="center">
    Share your files with the internet
    <br />
    <a href="https://github.com/JMax45/bagbytes/issues">Report Bug</a>
  </p>
</p>



<!-- TABLE OF CONTENTS -->
<details open="open">
  <summary>Table of Contents</summary>
  <ol>
    <li>
      <a href="#about-the-project">About The Project</a>
      <ul>
        <li><a href="#built-with">Built With</a></li>
      </ul>
    </li>
    <li>
      <a href="#getting-started">Getting Started</a>
      <ul>
        <li><a href="#installation">Installation</a></li>
      </ul>
    </li>
    <li><a href="#distributor-usage">Usage</a></li>
    <li><a href="#contributing">Contributing</a></li>
    <li><a href="#license">License</a></li>
    <li><a href="#acknowledgements">Acknowledgements</a></li>
  </ol>
</details>



<!-- ABOUT THE PROJECT -->
## About The Project
BagBytes is an **experimental** file exchange program that allows you to distribute files from your computer to other users.
It has a server mode that allows to have multiple distributors and clients but it also has a direct mode which allows to distribute files without a server.

[![Software demonstration 1][software-demonstration1]](#)
[![Software demonstration 2][software-demonstration2]](#)

### Built With

* [websockets/ws](https://github.com/websockets/ws)


## Getting Started

To get a local copy up and running follow these simple steps.

### Installation

1. Clone the repo
   ```sh
   git clone https://github.com/JMax45/bagbytes.git
   ```
2. Install NPM packages
   ```sh
   npm install
   ```
3. Build the necessary components
   ```JS
   npm run build-client
   npm run build-distributor
   npm run build-server // may not be necessary depending on your needs
   ```
The built files will be located in the ```dist``` folder.


<!-- USAGE EXAMPLES -->
## Distributor usage

You can start distributing with `node distributor.js file_path`

#### Options
* `--direct` will run without a server
* `--port` use in combination with direct
* `--tunnel` will run through a tunnel, provided by [localtunnel](https://github.com/localtunnel/localtunnel)

## Client usage

`node client.js --code[distribution code] --o [example.txt] --host [localhost] --port [8080]`

#### Options
* `--code` distribution code given to you by the distributor
* `--o` output file, default is current folder
* `--host` distributor host, default is localhost
* `--port` distributor port, default is 8080

## Server usage

`node server.js --port 8080`

#### Options
* `--port` server port, default is 8080

<!-- CONTRIBUTING -->
## Contributing

Any contributions you make are **greatly appreciated**.

1. Fork the Project
2. Create your Feature Branch (`git checkout -b feature/MyFeature`)
3. Commit your Changes (`git commit -m 'Add MyFeature'`)
4. Push to the Branch (`git push origin feature/MyFeature`)
5. Open a Pull Request



<!-- LICENSE -->
## License

Distributed under the MIT License. See `LICENSE` for more information.


<!-- ACKNOWLEDGEMENTS -->
## Acknowledgements
* [Technology vector created by upklyak - www.freepik.com](https://www.freepik.com/vectors/technology)
* [3d Vectors by Vecteezy](https://www.vecteezy.com/free-vector/3d)
* [Demonstration pictures created by Zeverotti](https://github.com/Zeverotti)
* [README template by othneildrew](https://github.com/othneildrew/Best-README-Template)

<!-- MARKDOWN LINKS & IMAGES -->
<!-- https://www.markdownguide.org/basic-syntax/#reference-style-links -->
[contributors-shield]: https://img.shields.io/github/contributors/JMax45/bagbytes?style=for-the-badge
[contributors-url]: https://github.com/JMax45/bagbytes/graphs/contributors
[issues-shield]: https://img.shields.io/github/issues/JMax45/bagbytes?style=for-the-badge
[issues-url]: https://github.com/JMax45/bagbytes/issues
[license-shield]: https://img.shields.io/github/license/JMax45/bagbytes?style=for-the-badge
[license-url]: https://github.com/JMax45/bagbytes/blob/master/LICENSE.txt
[software-demonstration1]: https://i.imgur.com/OYPJnz4.jpeg
[software-demonstration2]: https://i.imgur.com/0Eq3iRd.jpeg