class Region < ApplicationRecord
	validates :name, presence: true
	has_and_belongs_to_many :resources
	after_create :init

	def init
		3.times do
			self.resources<<Resource.order("RANDOM()").first
		end
		data = {}
		self.resources.each do |resource|
			data[resource.id] = rand(50000..250000)
		end
		self.update(data: data.to_json)
	end
end
