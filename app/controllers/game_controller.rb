class GameController < ApiController
	before_action :require_login

	def initialize_data
		user = User.find_by_auth_token!(request.headers[:token])
		user.update(data: nil)
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

	def load_data
		user = User.find_by_auth_token!(request.headers[:token])
		render json: {
			status: "Grabbed user's data!",
			user: {
				username: user.username,
				data: user.data
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
