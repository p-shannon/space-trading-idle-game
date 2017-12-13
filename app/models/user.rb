class User < ApplicationRecord
	vallidates_uniqueness_of :username
	has_secure_password
end
