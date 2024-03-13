class VsextensionController < ApplicationController
  def index
    @vsextensions = Vsextension.all
  end
end
