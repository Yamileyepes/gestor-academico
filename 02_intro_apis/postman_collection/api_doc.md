# JSON PLACE HOLDER Documentation

You'll find below the different routes to consumi the free api resources https://jsonplaceholder.typicode.com/.

## POSTS

### GET

To get all posts up today, you should use the resource

* GET: `https://jsonplaceholder.typicode.com/posts`

to get a specific post, you can add the id in the url

* GET: `https://jsonplaceholder.typicode.com/posts/{id}`
* E.g. `https://jsonplaceholder.typicode.com/posts/1`

### POST

If you want to add a new post, you should consume the resource:

* POST: `https://jsonplaceholder.typicode.com/posts`

Besides, to built the request json: `Body/Raw/Json`

 ```json
    {
      "userId": 1, // You must guarantee that the user exists
      "id": 1, // not required
      "title": "Example title",
      "body": "Example body"  
    },
 ```

### PUT

If you want to update a post, you should consume the resource:

* PUT: `https://jsonplaceholder.typicode.com/posts/{id}`

Besides, to built the request json: `Body/Raw/Json`

 ```json
    {
      "userId": 1, // You must guarantee that the user exists
      "id": 1,
      "title": "Example title updated",
      "body": "Example body updated"  
    }
 ```

### DELETE

If you want to delete a post, you should consume the resource:

* PUT: `https://jsonplaceholder.typicode.com/posts/{id}`

The body is not required in this kind of requests.
