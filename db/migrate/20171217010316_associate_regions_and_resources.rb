class AssociateRegionsAndResources < ActiveRecord::Migration[5.1]
  def change
	create_table :regions_resources, id: false do |t|
    	t.belongs_to :region, index: true
    	t.belongs_to :resource, index: true
  	end
  end
end