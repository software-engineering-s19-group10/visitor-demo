const createListItem = function(contents) {

const list_item = document.createElement('li');
  list_item.appendChild(contents);

  return list_item;
}

const createVisitor = function(door_id, visitor_key, ...details) {
  const visitor = document.createElement('li');
  visitor.classList.add('visitor');

  const visitor_details = document.createElement('ul');

  // Add the visitor key first
  visitor_details.appendChild(createListItem(document.createTextNode(visitor_key)));

  for (let i = 0; i < details.length; i++)
    visitor_details.appendChild(createListItem(document.createTextNode(details[i])));

  visitor.append(visitor_details);

  visitor.addEventListener('click', () => {
    // Write a string to the clipboard
    navigator.clipboard.writeText('127.0.0.1:8080/visitor.html?door=' + door_id + '&visitor=' + visitor_key)
      .then(
        () => { window.alert('Visitor URL copied to clipboard'); },
        () => { window.alert('Failed copying URL to clipboard!'); });
  });

  return visitor;
}

const postNewVisitor = function(...detail_obj) {
  fetch('http://127.0.0.1:8080/api/visitors/new/', {
    method: 'post',
    headers: {
      'Accept': 'application/json, text/plain, */*',
      'Content-Type': 'application/json'
    },
    body: JSON.stringify({name: detail_obj[0]})
  }).then(res => res.json())
    .then(res => {
      const visitor_data = res['data']['visitor'];
      const new_visitor = createVisitor(res['data']['door_id'], visitor_data['key'], visitor_data['name']);
      visitors.appendChild(new_visitor);
    });
}

const visitor_name = document.getElementById('visitor-name')
      visitor_add = document.getElementById('visitor-add')
      visitor_clear = document.getElementById('visitor-clear');

visitor_add.addEventListener('click', () => {
  postNewVisitor(visitor_name.value);
  visitor_name.value = '';
});

visitor_clear.addEventListener('click', () => visitor_name.value = '')

const visitors = document.createElement('ul');
visitors.setAttribute('id', 'visitor-list');

fetch('http://127.0.0.1:8080/api/visitors/')
  .then(response => response.json())
  .then(data => {
    const door_id = data['data']['door_id'];
    const visitor_keys = data['data']['visitor_keys'];

    for (let key in visitor_keys) {
      const visitor = createVisitor(door_id, key, visitor_keys[key]);
      visitors.appendChild(visitor);
    };
  });

document.body.appendChild(visitors);

