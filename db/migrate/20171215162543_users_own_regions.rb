class UsersOwnRegions < ActiveRecord::Migration[5.1]
  def change
  	add_column :regions, :user_id, :integer
  end
end
