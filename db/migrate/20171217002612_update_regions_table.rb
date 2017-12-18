class UpdateRegionsTable < ActiveRecord::Migration[5.1]
  def change
  	add_column :regions, :special_resource_A, :integer
  	add_column :regions, :special_resource_B, :integer
  	add_column :regions, :special_resource_C, :integer
  end
end
