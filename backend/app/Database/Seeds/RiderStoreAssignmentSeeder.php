<?php

namespace App\Database\Seeds;

use CodeIgniter\Database\Seeder;

class RiderStoreAssignmentSeeder extends Seeder
{
    public function run()
    {
        // Get rider role ID
        $rider_role = $this->db->table('roles')->where('name', 'rider')->get()->getRow();
        if (!$rider_role) {
            return; // No rider role found
        }
        $rider_role_id = $rider_role->id;

        // Get all riders that don't have a store_id
        $riders = $this->db->table('users')
                           ->where('role_id', $rider_role_id)
                           ->where('store_id IS NULL')
                           ->get()
                           ->getResultArray();

        // Get the first store to assign them to
        $first_store = $this->db->table('stores')->orderBy('id', 'ASC')->get()->getRow();
        if (!$first_store || empty($riders)) {
            return; // No stores or riders to assign
        }

        // Assign all unassigned riders to the first store
        foreach ($riders as $rider) {
            $this->db->table('users')
                     ->where('id', $rider['id'])
                     ->update(['store_id' => $first_store->id]);
        }
    }
}
