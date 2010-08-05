  module Encryptable
   def signable_string
     ""
   end
    def verify_creator_signature
      verify_signature(creator_signature, person)
    end
    
    def verify_signature(signature, person)
      return false unless signature && person.key_fingerprint
      validity = nil
      Rails.logger.info("Verifying sig on #{signable_string} from person #{person.real_name}")
      person.key.verify "SHA", signature, signable_string
      
    end
    
    protected
    def sign_if_mine
      if self.person == User.owner
        self.creator_signature = sign
      end
    end

    def sign
      sign_with_key(User.owner.key)
    end

    def sign_with_key(key)
      Rails.logger.info("Signing #{signable_string}")
      key.sign "SHA", signable_string
      
    end
  end

