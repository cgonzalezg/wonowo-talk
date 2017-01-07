# wonowo-talk
Small service written is nodejs that use WIT.ia to analyze a sentence and then return wonowo offers links.
### Limitation
Right now only works with English sentence because WIT and Spanish does not understand each other as good as they should.
## Structure
```
+------------------------+                                  +--------------------------+
|                        |                                  |                          |
|                        |                                  |                          |
|                        |                                  |                          |
|         wit            |                                  |           brower         |
|                        |                                  |                          |
|                        |                                  |                          |
|                        |                                  |                          |
|                        |                                  |                          |
+----------+-------------+                                  +------------+-------------+
           ^                                                             |
           |                                                             |
           |                                                             |
           |                 +-----------------------+                   |
           |                 |                       |                   |
           |                 |                       |                   |
           |                 |                       |                   |
           |                 |       service         |                   |
           +-----------------+                       | <-----------------+
                             |                       |
                             |                       |
                             |                       |
                             +-----------------------+

```

## Run it
install dependencies

`$ npm install `

install swagger for development  

`$ npm install --save swagger`


run development mode

`$ WIT_CLIENT_KEY={your wit server key} project start`



## Test it

`$ swagger project test`

## Use it

POST request to
`http://localhost:5000/api/v0/recomendations0`

```json
{
    "text": "holidays in Barcelona ",
    "locale": "es-ES",
    "date": "2016-11-27T11:40:25.677Z",
    "timezone": "Europe/Madrid",
    "initCity": "Madrid"
}
```
more info in the [swagger spec file](api/swagger/swagger.yaml)
