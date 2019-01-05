const Pool = require('pg').Pool;

// GET all spaces
const getSpaces = (request, response) => {
  pool.query(
    `SELECT 
        s.id AS space_id, 
        s.title AS space_title, 
        coalesce(w.pages, '[]') AS pages
      FROM spaces s 
      LEFT JOIN (
        SELECT 
          w.space_id,
          json_agg(json_build_object('title', w.title, 'id', w.id)) AS pages
        FROM wikipages w
        GROUP BY 1
      ) w
      ON w.space_id = s.id 
      ORDER BY s.id ASC
    `,
    (error, results) => {
      if (error) {
        throw error;
      }
      response.status(200).json(results.rows);
    }
  );
};

// GET a single space by id
const getSpaceById = (request, response) => {
  const space_id = parseInt(request.params.space_id);

  pool.query(
    'SELECT * FROM spaces WHERE id = $1',
    [space_id],
    (error, results) => {
      if (error) {
        throw error;
      }
      response.status(200).json(results.rows);
    }
  );
};

// POST a new space
const createSpace = (request, response) => {
  const { title } = request.body;
  pool.query(
    'INSERT INTO spaces (title) VALUES ($1) RETURNING id',
    [title],
    (error, results) => {
      if (error) {
        throw error;
      }
      response.status(201).json({ id: results.rows[0].id });
    }
  );
};

// PUT updated data in an existing space
const updateSpace = (request, response) => {
  const space_id = parseInt(request.params.space_id);
  const { title } = request.body;

  pool.query(
    'UPDATE spaces SET title = $1 WHERE id = $2',
    [title, space_id],
    (error, results) => {
      if (error) {
        throw error;
      }
      response.status(200).send(`Space modified with ID: ${space_id}`);
    }
  );
};

// DELETE a space
// This will automatically delete related wikipages
const deleteSpace = (request, response) => {
  const space_id = parseInt(request.params.space_id);
  pool.query(
    'DELETE FROM spaces WHERE id = $1',
    [space_id],
    (error, results) => {
      if (error) {
        throw error;
      }
      response.status(200).send(`Spaces deleted with ID: ${space_id}`);
    }
  );
};

// GET all wikipages
const getWikipages = (request, response) => {
  pool.query(
    `SELECT 
      w.id, 
      w.title, 
      w.updated_at, 
      w.space_id,
      w.content,
      s.title as space_title
    FROM wikipages w
    LEFT JOIN spaces s
    ON s.id = w.space_id
    ORDER BY updated_at DESC
    LIMIT 5`,
    (error, results) => {
      if (error) {
        throw error;
      }
      response.status(200).json(results.rows);
    }
  );
};

// GET a single wikipage by id
const getWikipageById = (request, response) => {
  const id = parseInt(request.params.id);
  pool.query(
    'SELECT * FROM wikipages WHERE id = $1',
    [id],
    (error, results) => {
      if (error) {
        throw error;
      }
      response.status(200).json(results.rows);
    }
  );
};

// POST a new wikipage
const createWikipage = (request, response) => {
  const { title, content, space_id } = request.body;
  pool.query(
    'INSERT INTO wikipages (title, content, space_id) VALUES ($1, $2, $3) RETURNING id',
    [title, content, space_id],
    (error, results) => {
      if (error) {
        throw error;
      }
      response.status(201).json({ id: results.rows[0].id });
    }
  );
};

// PUT update data in an existing wikipage
const updateWikipage = (request, response) => {
  const id = parseInt(request.params.id);
  const { title, content } = request.body;

  pool.query(
    'UPDATE wikipages SET title = $1, content = $2 WHERE id = $3',
    [title, content, id],
    (error, results) => {
      if (error) {
        throw error;
      }
      response.status(200).send(`Wikipage modified with ID: ${id}`);
    }
  );
};

// DELETE a wikipage
const deleteWikipage = (request, response) => {
  const id = parseInt(request.params.id);

  pool.query('DELETE FROM wikipages WHERE id = $1', [id], (error, results) => {
    if (error) {
      throw error;
    }
    response.status(200).send(`Wikipage deleted with ID: ${id}`);
  });
};

module.exports = {
  getWikipages,
  getWikipageById,
  createWikipage,
  updateWikipage,
  deleteWikipage,
  getSpaces,
  getSpaceById,
  createSpace,
  updateSpace,
  deleteSpace
};
