# Auto Signature App APIs (v7-2)

## API Doc Url
* https://auto-signature-app-v7-2.fly.dev/api-doc/
<br/>

## Change Log
* /file [GET] api: use query strings to get specific file data (e.g. /file?from=0& count=100)
<br/>
* /file [POST] api: remove query strings "title" and "isSigned" and return new file id.
<br/>
* /file/{id}/signInfo [PATCH] api: update only title and isSigned. Use json format body to send request.
<br/>
* /file/{id}/fileInfo [PATCH] api: update a new file to replace old file.
<br/>
* Only allow pdf file uploaded
<br/>

## Note
* If you want to download files, just call /file [GET] api to get files information first. You will get an array includes multiple objects. Make sure you have to store these information in your front-end state. Each file object includes a key "fileLocation", use javascript method "fetch" to download target file.