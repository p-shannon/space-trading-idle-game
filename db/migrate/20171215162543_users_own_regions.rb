class UsersOwnRegions < ActiveRecord::Migration[5.1]
  def change
  	add_column :region, :user_id, :integer
  end
end
