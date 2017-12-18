class GivesRegionsASaveState < ActiveRecord::Migration[5.1]
  def change
  	add_column :regions, :data, :string
  end
end
