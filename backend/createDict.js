const baseUrl = "http://localhost:5050";

const createDict = async () =>{
    let results = await fetch(`${baseUrl}/api/posts`).then(resp => resp.json());
}

//createDict()