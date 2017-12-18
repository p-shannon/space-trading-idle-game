class GameController < ApiController
	before_action :require_login

	def initialize_data
		user = User.find_by_auth_token!(request.headers[:token])
		user.update(data: nil) #Also needs to abandon all territories
		render json: {
			status: "User's data reset!",
			user: {
				username: user.username,
				data: user.data
			}
		}
	end

	def save_data
		user = User.find_by_auth_token!(request.headers[:token])
		user.update(data: params[:data].to_json)
		render json: {
			status: "User's data saved!",
			user: {
				username: user.username,
				data: user.data
			}
		}
	end

	def save_region
		user = User.find_by_auth_token!(request.headers[:token])
		region = Region.find(params[:id])
		if user.id == region.user_id
			region.update(data: params[:data].to_json)
			render json: {
				status: "Region data saved!",
				region: region
			}
		else
			render json: {
				status: "Error: Cannot save region that doesn't belong to you."
			}
		end
	end

	def load_data
		user = User.find_by_auth_token!(request.headers[:token])
		regions = user.regions
		regions = regions.map{|region|
			{
				region:region,
				resources:region.resources
			}
		}
		render json: {
			status: "Grabbed user's data!",
			user: {
				username: user.username,
				data: user.data,
				regions: regions
			}
		}
	end

	def occupy_region
		user = User.find_by_auth_token!(request.headers[:token])
		region = Region.find(params[:id])
		unless region.user_id
			region.update(user_id: user.id)
			render json: {
				message: "Moved into region successfully!",
				region: region
			}
		else
			render json: {
				message: "Error: Cannot move into occupied regions"
			}
		end
	end

	def abandon_region
		region = Region.find(params[:id])
		region.update(user_id: nil)
		render json: {
			message: "Region abandoned successfully!"
		}
	end

end
