class ResourcesController < ApplicationController
	def index
		render json: {
			status: "Resources fetched successfully!",
			resources: Resource.all
		}
	end
end
