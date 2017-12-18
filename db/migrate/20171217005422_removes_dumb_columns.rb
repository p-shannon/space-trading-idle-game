class RemovesDumbColumns < ActiveRecord::Migration[5.1]
  def change
  	remove_column :regions, :special_resource_A
  	remove_column :regions, :special_resource_B
  	remove_column :regions, :special_resource_C
  end
end
