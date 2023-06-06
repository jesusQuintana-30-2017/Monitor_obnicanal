const fs = require('fs');
const Cryptr = require('cryptr');
const cryptr = new Cryptr('bsw2019');

var conf = {
    conexiones: [{
        id: 1,
        select: false,
        nombre: "SDB 10.142-10.145/10.144",
        mysql: {
            crm: {
                ip: "10.25.10.144",
                usuario: "bswcrm_user",
                contrasena: "Entrada2020$",
                baseDatos: "bstntrn",
            },
            cc: {
                ip: "10.25.10.145",
                usuario: "bswcc_user",
                contrasena: "Entrada2020$",
                baseDatos: "asteriskcdrdb",
            },
            cc2: {
                ip: "10.25.10.142",
                usuario: "bswcc_user",
                contrasena: "Entrada2020$",
                baseDatos: "asteriskcdrdb",
            },
            cc3: {
                ip: "0.0.0.0",
                usuario: "bswcc_user",
                contrasena: "Entrada2020$",
                baseDatos: "asteriskcdrdb",
            },
            cc4: {
                ip: "0.0.0.1",
                usuario: "bswcc_user",
                contrasena: "Entrada2020$",
                baseDatos: "asteriskcdrdb",
            },
            cc5: {
                ip: "0.0.0.2",
                usuario: "bswcc_user",
                contrasena: "Entrada2020$",
                baseDatos: "asteriskcdrdb",
            },
            cc6: {
                ip: "0.0.0.3",
                usuario: "bswcc_user",
                contrasena: "Entrada2020$",
                baseDatos: "asteriskcdrdb",
            },
            cc7: {
                ip: "0.0.0.4",
                usuario: "bswcc_user",
                contrasena: "Entrada2020$",
                baseDatos: "asteriskcdrdb",
            },
            cc8: {
                ip: "0.0.0.5",
                usuario: "bswcc_user",
                contrasena: "Entrada2020$",
                baseDatos: "asteriskcdrdb",
            },
            cco: {
                ip: "10.25.10.145",
                usuario: "bswcc_user",
                contrasena: "Entrada2020$",
                baseDatos: "asteriskcdrdb",
            },
            mde: {
              ip: "10.25.10.144",
              usuario: "bswcrm_user",
              contrasena: "Entrada2020$",
              baseDatos: "inmc",
            },
            hist: {
              ip: "10.25.10.144",
              usuario: "bswcrm_user",
              contrasena: "Entrada2020$",
              baseDatos: "bstntrn",
            }
        },
        urls: {
            login: "http://10.25.10.144:8080/P8821/P821"
        }
    },{
        id: 2,
        select: false,
        nombre: "SDB 41.245-41.142/41.244",
        mysql: {
            crm: {
                ip: "10.25.10.244",
                usuario: "bswcrm_user",
                contrasena: "Entrada2020$",
                baseDatos: "bstntrn",
            },
            cc: {
                ip: "10.25.10.145",
                usuario: "bswcc_user",
                contrasena: "Entrada2020$",
                baseDatos: "asteriskcdrdb",
            },
            cc2: {
                ip: "10.25.10.142",
                usuario: "bswcc_user",
                contrasena: "Entrada2020$",
                baseDatos: "asteriskcdrdb",
            },
            cc3: {
                ip: "10.25.10.142",
                usuario: "bswcc_user",
                contrasena: "Entrada2020$",
                baseDatos: "asteriskcdrdb",
            },
            cc4: {
                ip: "10.25.10.142",
                usuario: "bswcc_user",
                contrasena: "Entrada2020$",
                baseDatos: "asteriskcdrdb",
            },
            cc5: {
                ip: "10.25.10.142",
                usuario: "bswcc_user",
                contrasena: "Entrada2020$",
                baseDatos: "asteriskcdrdb",
            },
            cc6: {
                ip: "10.25.10.142",
                usuario: "bswcc_user",
                contrasena: "Entrada2020$",
                baseDatos: "asteriskcdrdb",
            },
            cc7: {
                ip: "10.25.10.142",
                usuario: "bswcc_user",
                contrasena: "Entrada2020$",
                baseDatos: "asteriskcdrdb",
            },
            cc8: {
                ip: "10.25.10.142",
                usuario: "bswcc_user",
                contrasena: "Entrada2020$",
                baseDatos: "asteriskcdrdb",
            },
            cco: {
                ip: "10.25.10.145",
                usuario: "bswcc_user",
                contrasena: "Entrada2020$",
                baseDatos: "asteriskcdrdb",
            },
            mde: {
              ip: "10.25.10.144",
              usuario: "bswcrm_user",
              contrasena: "Entrada2020$",
              baseDatos: "inmc",
            },
            hist: {
              ip: "10.25.10.144",
              usuario: "bswcrm_user",
              contrasena: "Entrada2020$",
              baseDatos: "bstntrn",
            }
        },
        urls: {
            login: "http://10.25.10.144:8080/P8821/P821"
        }
    }
    
    ]

}


const conexiones = cryptr.encrypt(JSON.stringify(conf));

let cnn = {
    conexiones
};

let data = JSON.stringify(cnn);
fs.writeFileSync('cnn2020.json', data);