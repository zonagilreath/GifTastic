const topics = [
    "dog",
    "cat",
    "monkey",
    "fish",
    "elephant",
    "racecar",
    "star wars",
    "anime"
]

class QueryButton {
    constructor(name) {
        this.name = name;
        this.button = $("<button>").html(name).attr("id", this.name).addClass("btn");
    }

    addButton(){
       $("#query-buttons").append(this.button);
       this.button.on("click", this.makeQuery); 
    }

    makeQuery(){
        let URL = `https://api.giphy.com/v1/gifs/search?api_key=NTIKetJ1J6FzCm3o6BPmGJ7odJRGvQ8M&q=${this.id}&limit=10offset=0&rating=PG-13&lang=en`;
        $.ajax({
            url : URL,
            method : "GET",
        }).then((response)=>{
            $("#results").empty();
            const results = response.data;
            results.forEach(result => {
                let stillURL = result.images.fixed_height_still.url
                let animURL = result.images.fixed_height.url;
                let rating = result.rating;
                new GIF(stillURL, animURL, rating); 
            });
        });
    }
}

class GIF {
    constructor(stillURL, animURL, rating){
        this.stillURL = stillURL;
        this.animURL = animURL;
        this.rating = rating;

        this.fig = $("<figure>")
        this.img_element = $("<img>").attr("src", this.stillURL);
        this.img_element.addClass("gif");
        this.img_element.attr("data-state", "still");
        this.img_element.attr("data-still", this.stillURL);
        this.img_element.attr("data-animate", this.animURL);

        this.fig.append(this.img_element);
        this.fig.append($("<figcaption>").text("Rating: " + this.rating));

        $("#results").append(this.fig);
        this.img_element.on("click", this.toggleAnim);
    }

    toggleAnim(){
        // The attr jQuery method allows us to get or set the value of any attribute on our HTML element
        var state = $(this).attr("data-state");
        // If the clicked image's state is still, update its src attribute to what its data-animate value is.
        // Then, set the image's data-state to animate
        // Else set src to the data-still value
        if (state === "still") {
          $(this).attr("src", $(this).attr("data-animate"));
          $(this).attr("data-state", "animate");
        } else {
          $(this).attr("src", $(this).attr("data-still"));
          $(this).attr("data-state", "still");
        }
    }
}

function addQuery(topic){
    let newButton = new QueryButton(topic);
    newButton.addButton();
}

$(document).ready(function(){
    topics.forEach(function(topic){
        addQuery(topic);
    });
    
    $("#add-query-form").on("submit", function(e){
        e.preventDefault();
        let topic = this.query_term.value;
        if (topic.length && !topics.includes(topic)){
            topics.push(topic);
            addQuery(topic);
        }
        this.query_term.value = "";
    });
})