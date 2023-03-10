# Auto Signature App APIs (v3)

## API Doc Url
* https://auto-signature-app-v3.fly.dev/api-doc/
<br/>

## Change Log
* remove download api
<br/>

## Note
* If you want to download files, just call getFiles(GET) api to get files information first. You will get an array includes multiple objects. Make sure you have to store these information in your front-end state. Each file object includes a key "fileLocation", use javascript grammar "fetch" to download target file.