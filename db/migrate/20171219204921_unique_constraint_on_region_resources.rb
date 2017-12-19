class UniqueConstraintOnRegionResources < ActiveRecord::Migration[5.1]
  def change
  	add_index :regions_resources, [:region_id, :resource_id], :unique => true
  end
end
