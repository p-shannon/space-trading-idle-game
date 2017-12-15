class RegionsController < ApplicationController
	
	def create
		region = Region.create!(params[:region])
		render json: {
			message: "Region created successfully!",
			region: region
		}
	end

	#Make sure users can move in too.
end
