Promise.all([
  fetch('https://raw.githubusercontent.com/no-stack-dub-sack/testable-projects-fcc/master/src/data/choropleth_map/for_user_education.json').then(value => value.json()),
  fetch("https://raw.githubusercontent.com/no-stack-dub-sack/testable-projects-fcc/master/src/data/choropleth_map/counties.json").then(value => value.json())
])
  .then((value) => {
    console.log(value[0])
    console.log(value[1])

   
    //json response
  })
  .catch((err) => {
    console.log(err);
  });

