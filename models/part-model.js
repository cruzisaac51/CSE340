const pool = require("../database/")

const partModel = {}

partModel.getParts = async (sortBy = 'ASC') => {
  try {
    let query = "SELECT * FROM public.part ORDER BY part_price ASC";
    if (sortBy === 'DESC') {
      query = "SELECT * FROM public.part ORDER BY part_price DESC";
    }
    const data = await pool.query(query);
    return data.rows;
  } catch (error) {
    console.error("getParts error " + error);
    throw error;
  }
}

module.exports = partModel;
