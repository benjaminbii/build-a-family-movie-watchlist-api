
import express from "express";
import {
  getWatchlist,
  addMovie,
  updateMovie,
  deleteMovie
} from "../utils/db.js";
import { authenticate } from "../middleware/authenticate.js";
import { authorizeModification } from "../middleware/authorize.js";

const router = express.Router();

// GET a user's watchlist
router.get("/:userId", authenticate, (req, res) => {
  const watchlist = getWatchlist(req.params.userId);

  if (watchlist === null) {
    return res.status(404).json({ error: "User not found" });
  }

  return res.status(200).json(watchlist);
});

// POST a new movie
router.post(
  "/:userId/movies",
  authenticate,
  authorizeModification,
  (req, res) => {
    const movie = addMovie(req.params.userId, req.body);

    if (movie === null) {
      return res.status(404).json({ error: "User not found" });
    }

    return res.status(201).json(movie);
  }
);

// PUT to update a movie
router.put(
  "/:userId/movies/:movieId",
  authenticate,
  authorizeModification,
  (req, res) => {
    const movie = updateMovie(
      req.params.userId,
      Number(req.params.movieId),
      req.body
    );

    if (movie === null) {
      return res.status(404).json({ error: "Movie or user not found" });
    }

    return res.status(200).json(movie);
  }
);

// DELETE a movie
router.delete(
  "/:userId/movies/:movieId",
  authenticate,
  authorizeModification,
  (req, res) => {
    const deleted = deleteMovie(
      req.params.userId,
      Number(req.params.movieId)
    );

    if (!deleted) {
      return res.status(404).json({ error: "Movie or user not found" });
    }

    return res.status(200).json({ message: "Movie deleted successfully" });
  }
);

export default router;
