const express = require('express');
const cors = require('cors');
const { uuid, isUuid } = require('uuidv4');

const app = express();

app.use(express.json());
app.use(cors());

function validateRepositoryId(request, response, next) {
  const { id } = request.params;

  if (!isUuid(id)) {
    return response.status(400).json({ error: 'Invalid repository ID.' });
  }
  return next();
}

const repositories = [];

app.get('/repositories', (request, response) => {
  return response.status(200).json(repositories);
});

app.post('/repositories', (request, response) => {
  const { title, url, techs } = request.body;

  const repo = { id: uuid(), title, url, techs, likes: 0 };

  repositories.push(repo);
  return response.status(201).json(repo);
});

app.put('/repositories/:id', validateRepositoryId, (request, response) => {
  const { id } = request.params;
  const { title, url, techs } = request.body;

  const repoIndex = repositories.findIndex((repo) => repo.id === id);

  if (repoIndex < 0) {
    return response.status(400).json({ error: 'Repository not found.' });
  }

  const updatedRepo = {
    id,
    title,
    url,
    techs,
    likes: repositories[repoIndex].likes,
  };

  repositories[repoIndex] = updatedRepo;
  return response.json(updatedRepo);
});

app.delete('/repositories/:id', validateRepositoryId, (request, response) => {
  const { id } = request.params;

  const repoIndex = repositories.findIndex((repo) => repo.id === id);

  if (repoIndex < 0) {
    return response.status(400).json({ error: 'Repository not found.' });
  }

  repositories.splice(repoIndex, 1);
  return response.status(204).send();
});

app.post(
  '/repositories/:id/like',
  validateRepositoryId,
  (request, response) => {
    const { id } = request.params;

    const repoIndex = repositories.findIndex((repo) => repo.id === id);

    if (repoIndex < 0) {
      return response.status(400).json({ error: 'Repository not found.' });
    }

    repositories[repoIndex].likes++;
    return response.json(repositories[repoIndex]);
  }
);

module.exports = app;
