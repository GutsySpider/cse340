const pool = require("../database/")

/* ***************************
 *  Get all Item data
 *************************** */
async function getItems() {
  return await pool.query("SELECT * FROM public.inventory")
}

/* ***************************
 *  Get item by inv_id
 *************************** */
async function getItemByInventoryId(inv_id) {
  try {
    const sql = `
      SELECT * FROM public.inventory
      WHERE inv_id = $1
    `
    const data = await pool.query(sql, [inv_id])
    return data.rows[0]
  } catch (error) {
    console.error("getItemByInventoryId error:", error)
    throw error
  }
}

module.exports = { getItems, getItemByInventoryId }