class RegionsController < ApiController
	before_action :require_login, only: [:update]
	def create
		region = Region.create!(region_params)
		render json: {
			message: "Region created successfully!",
			region: region
		}
	end

	def index
		render json: {
			message: "Regions fetched successfully!",
			regions: Region.all
		}
	end

	def update
		region = Region.find(params[:id])
		user = User.find_by_auth_token!(request.headers[:token])
		if region.user_id == user.id
			region.update(region_params)
			render json: {
				message: "Region updated successfully!",
				region: region
			}
		else
			render json: {
				message: "Error: can't edit others regions."
			}
		end
	end

	private
	def region_params
		params.require(:region).permit(:name, :description)
	end
end
