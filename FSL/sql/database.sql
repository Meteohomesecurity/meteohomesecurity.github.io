"# Meteo Home Security - Guida Installazione XAMPP

## Struttura del Progetto

```
meteo_home_security/
├── index.html              # Homepage
├── prodotti.html           # Pagina prodotti
├── chi-siamo.html          # Pagina chi siamo
├── contatti.html           # Pagina contatti
├── carrello.html           # Carrello e checkout
├── login.html              # Pagina login
├── registrazione.html      # Pagina registrazione
├── css/
│   └── style.css           # Stili CSS
├── js/
│   └── carrello.js         # JavaScript carrello
├── images/                 # Immagini (copia qui il logo e foto)
├── cgi-bin/                # Script CGI in C
│   ├── login.c
│   ├── registrazione.c
│   ├── contatti.c
│   └── ordine.c
└── sql/
    └── database.sql        # Schema database MySQL
```

## Installazione

### 1. Copia i file in XAMPP

Copia l'intera cartella `meteo_home_security` in:
```
C:\xampp\htdocs\mhs
```

### 2. Configura il Database MySQL

1. Avvia XAMPP (Apache + MySQL)
2. Apri phpMyAdmin: http://localhost/phpmyadmin
3. Vai su \"Importa\"
4. Seleziona il file `sql/database.sql`
5. Clicca \"Esegui\"

### 3. Compila i file CGI

Apri il terminale e vai nella cartella cgi-bin:

```bash
cd C:\xampp\htdocs\mhs\cgi-bin

# Compila ogni file
gcc -o login.cgi login.c -lmysqlclient
gcc -o registrazione.cgi registrazione.c -lmysqlclient
gcc -o contatti.cgi contatti.c -lmysqlclient
gcc -o ordine.cgi ordine.c -lmysqlclient
```

**Se usi Windows con MinGW:**
```bash
gcc -o login.exe login.c -I\"C:\xampp\mysql\include\" -L\"C:\xampp\mysql\lib\" -lmysql
```

### 4. Configura Apache per CGI

Modifica `C:\xampp\apache\conf\httpd.conf`:

1. Trova e decommenta:
```apache
LoadModule cgi_module modules/mod_cgi.so
```

2. Aggiungi questa configurazione:
```apache
<Directory \"C:/xampp/htdocs/mhs/cgi-bin\">
    Options +ExecCGI
    AddHandler cgi-script .cgi .exe
    Require all granted
</Directory>
```

3. Riavvia Apache

### 5. Aggiungi le Immagini

Copia nella cartella `images/`:
- `LogoMHS4.png` - Il tuo logo
- `slide1.jpg`, `slide2.jpg`, `slide3.jpg` - Immagini per lo slider

### 6. Test

Apri il browser e vai a:
```
http://localhost/mhs/
```

## Credenziali di Default

- **Admin Email:** admin@meteohomesecurity.it
- **Admin Password:** admin123

## Configurazione MySQL nei file C

Se la tua password MySQL non è vuota, modifica in ogni file .c:
```c
#define DB_PASS \"la_tua_password\"
```

## Funzionalità

✅ Homepage con slider animato
✅ Catalogo prodotti con filtri
✅ Carrello funzionante (localStorage)
✅ Checkout con form spedizione
✅ Sistema login/registrazione
✅ Form contatti
✅ Pagina \"Chi Siamo\"
✅ Design responsive
✅ Database MySQL per dati

## Supporto

Per problemi con la compilazione CGI, assicurati di avere:
- MinGW o GCC installato
- MySQL Connector/C installato
- Le variabili PATH configurate correttamente
"