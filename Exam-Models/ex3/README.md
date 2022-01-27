# Products

To inventory the products in the store, a small store uses a client-server system.
The server provides a list of products, each product having the following props
  - id - integer,
  - name - string,
and a list of inventory items, each item having
  - productId - integer,
  - quantity - number,
  - version - integer incremented by the server whenever the item is updated.
Develop a mobile application (client) as follows.

1. When the app starts, the list of products and the list of inventory items are
fetched in parallel via GET /product [1p], respectively GET /item [1p].

2. A list shows the data fetched at 1 [1.5p], each entry showing the product name and its quantity [0.5p].
When the user clicks on an entry of this list, the entry changes its background
indicating the current unique selection of the list [0.5p]

3. An input field allows the user to enter a quantity, and an 'Add' button allows him/her to add
that quantity for the selected product [0.5p].
An HTTP PUT /item/:productId is used to update the selected item, including in the request body the
item received from the server, but with an updated quantity [1.5p].
If the PUT operation succeeds, the list updates its selected entry [0.5p].

4. If the HTTP PUT operation fails with 409 (version conflict), after the app informs the user
about version conflict, it will re-fetch the inventory list [0.5p] and it will keep the current selection),
allowing the user to retry the 'Add' operation [0.5p].

5. Whenever the app performs HTTP operations, it shows a progress indicator [0.5p].
Any IO errors will be reported to the user [0.5p].

