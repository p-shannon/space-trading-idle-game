class Region < ApplicationRecord
	has_one :user
	validates :name
end
