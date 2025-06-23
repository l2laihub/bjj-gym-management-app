import { useEffect, useState, useCallback } from 'react';
import { X, Mail, Calendar, Award, Activity, AlertCircle, Edit, Phone, Plus, User } from 'lucide-react';
import { Modal } from '../ui/Modal';
import { EmergencyContactForm } from './forms/EmergencyContactForm';
import { MedicalInfoForm } from './forms/MedicalInfoForm';
import { useToast } from '../../contexts/ToastContext';
import { getBeltColor } from '../../utils/beltUtils';
import { getMemberDetails } from '../../lib/members/queries';
import type { Member, MemberDetails } from '../../types/member';

interface MemberDetailsDrawerProps {
  member: Member | null;
  isOpen: boolean;
  onClose: () => void;
  onEdit: () => void;
}

export function MemberDetailsDrawer({ member, isOpen, onClose, onEdit }: MemberDetailsDrawerProps) {
  const [details, setDetails] = useState<MemberDetails | null>(null);
  const [loading, setLoading] = useState(true);
  const [showEmergencyContactModal, setShowEmergencyContactModal] = useState(false);
  const [showMedicalInfoModal, setShowMedicalInfoModal] = useState(false);
  const { showToast } = useToast();

  const loadMemberDetails = useCallback(async () => {
    if (!member) return;
    
    try {
      setLoading(true);
      const data = await getMemberDetails(member.id);
      setDetails(data);
    } catch (error) {
      console.error('Error loading member details:', error);
      showToast('error', 'Failed to load member details');
    } finally {
      setLoading(false);
    }
  }, [member, showToast]);

  useEffect(() => {
    if (member && isOpen) {
      loadMemberDetails();
    }
  }, [member, isOpen, loadMemberDetails]);



  if (!member) return null;

  return (
    <>
      <div className={`fixed inset-y-0 right-0 w-96 bg-white shadow-xl transform transition-transform duration-300 ${
        isOpen ? 'translate-x-0' : 'translate-x-full'
      }`}>
        <div className="h-full flex flex-col">
          {/* Header */}
          <div className="p-4 border-b flex justify-between items-center">
            <h2 className="text-lg font-semibold">Member Details</h2>
            <button 
              onClick={onClose} 
              className="p-2 hover:bg-gray-100 rounded-lg"
              title="Close"
              aria-label="Close details panel"
            >
              <X className="w-5 h-5" />
            </button>
          </div>

          {loading ? (
            <div className="flex-1 p-4">
              <div className="animate-pulse space-y-4">
                <div className="h-4 bg-gray-200 rounded w-3/4"></div>
                <div className="h-4 bg-gray-200 rounded w-1/2"></div>
                <div className="h-10 bg-gray-200 rounded"></div>
              </div>
            </div>
          ) : (
            <div className="flex-1 overflow-y-auto">
              {/* Basic Info */}
              <div className="p-4 border-b">
                <div className="flex items-center justify-between mb-4">
                  <h3 className="text-sm font-medium text-gray-500">Basic Information</h3>
                  <button
                    onClick={onEdit}
                    className="text-indigo-600 hover:text-indigo-800 text-sm font-medium flex items-center"
                  >
                    <Edit className="w-4 h-4 mr-1" />
                    Edit
                  </button>
                </div>
                <div className="space-y-3">
                  <div>
                    <p className="text-lg font-medium text-gray-900">{member.fullName}</p>
                    <div className="flex items-center text-sm text-gray-500 mt-1">
                      <Mail className="w-4 h-4 mr-1" />
                      {member.email}
                    </div>
                  </div>
                  {member.birthday && (
                    <div className="flex items-center text-sm text-gray-500">
                      <Calendar className="w-4 h-4 mr-1" />
                      Birthday: {new Date(member.birthday).toLocaleDateString()}
                    </div>
                  )}
                  {member.isMinor && member.parentName && (
                    <div className="flex items-center text-sm text-gray-500">
                      <User className="w-4 h-4 mr-1" />
                      Parent/Guardian: {member.parentName}
                    </div>
                  )}
                  <div className="flex items-center">
                    <div className={`w-4 h-4 ${getBeltColor(member.belt || 'white')} rounded-full mr-2`} />
                    <span className="capitalize">{member.belt || 'White'} Belt</span>
                    <div className="ml-2 flex space-x-1">
                      {[...Array(member.stripes || 0)].map((_, i) => (
                        <div key={i} className="w-2 h-2 bg-yellow-400 rounded-full" />
                      ))}
                    </div>
                  </div>
                  <div className="flex items-center">
                    <Calendar className="w-4 h-4 mr-2 text-gray-400" />
                    <span className="text-sm text-gray-500">
                      Member since {new Date(member.joinDate).toLocaleDateString()}
                    </span>
                  </div>
                </div>
              </div>

              {/* Status */}
              <div className="p-4 border-b">
                <h3 className="text-sm font-medium text-gray-500 mb-3">Status</h3>
                <div className="flex items-center">
                  <span className={`inline-flex items-center px-2.5 py-0.5 rounded-full text-xs font-medium ${
                    member.status === 'active' 
                      ? 'bg-green-100 text-green-800'
                      : 'bg-red-100 text-red-800'
                  }`}>
                    {member.status}
                  </span>
                  {member.lastActive && (
                    <span className="ml-2 text-sm text-gray-500">
                      Last active: {new Date(member.lastActive).toLocaleDateString()}
                    </span>
                  )}
                </div>
              </div>

              {/* Emergency Contact */}
              <div className="p-4 border-b">
                <div className="flex items-center justify-between mb-3">
                  <h3 className="text-sm font-medium text-gray-500">Emergency Contact</h3>
                  <button 
                    onClick={() => setShowEmergencyContactModal(true)}
                    className="text-indigo-600 hover:text-indigo-800 text-sm font-medium flex items-center"
                  >
                    <Plus className="w-4 h-4 mr-1" />
                    Add Contact
                  </button>
                </div>
                {details?.emergencyContact ? (
                  <div className="space-y-2">
                    <p className="font-medium text-gray-900">{details.emergencyContact.name}</p>
                    <div className="flex items-center text-sm text-gray-500">
                      <Phone className="w-4 h-4 mr-1" />
                      {details.emergencyContact.phone}
                    </div>
                    <p className="text-sm text-gray-500">
                      Relationship: {details.emergencyContact.relationship}
                    </p>
                  </div>
                ) : (
                  <div className="bg-gray-50 rounded-lg p-3">
                    <p className="text-sm text-gray-500">No emergency contact added</p>
                  </div>
                )}
              </div>

              {/* Belt History */}
              <div className="p-4 border-b">
                <h3 className="text-sm font-medium text-gray-500 mb-3">Belt History</h3>
                <div className="space-y-3">
                  {details?.beltHistory?.map((promotion, index) => (
                    <div key={index} className="flex items-center">
                      <div className="flex-shrink-0">
                        <Award className="w-5 h-5 text-indigo-600" />
                      </div>
                      <div className="ml-3">
                        <p className="text-sm font-medium text-gray-900">
                          Promoted to {promotion.belt} Belt
                          {promotion.stripes > 0 && ` (${promotion.stripes} stripes)`}
                        </p>
                        <p className="text-sm text-gray-500">
                          {new Date(promotion.promotedAt).toLocaleDateString()}
                        </p>
                      </div>
                    </div>
                  ))}
                </div>
              </div>

              {/* Recent Activity */}
              <div className="p-4 border-b">
                <h3 className="text-sm font-medium text-gray-500 mb-3">Recent Activity</h3>
                <div className="space-y-3">
                  {details?.recentActivity?.map((activity, index) => (
                    <div key={index} className="flex items-center">
                      <div className="flex-shrink-0">
                        <Activity className="w-5 h-5 text-green-600" />
                      </div>
                      <div className="ml-3">
                        <p className="text-sm font-medium text-gray-900">{activity.type}</p>
                        <p className="text-sm text-gray-500">
                          {new Date(activity.date).toLocaleDateString()}
                        </p>
                      </div>
                    </div>
                  ))}
                </div>
              </div>

              {/* Medical Information */}
              <div className="p-4">
                <div className="flex items-center justify-between mb-3">
                  <h3 className="text-sm font-medium text-gray-500">Medical Information</h3>
                  <button 
                    onClick={() => setShowMedicalInfoModal(true)}
                    className="text-indigo-600 hover:text-indigo-800 text-sm font-medium flex items-center"
                  >
                    <Plus className="w-4 h-4 mr-1" />
                    Add Info
                  </button>
                </div>
                {details?.medicalInfo ? (
                  <div className="space-y-2">
                    {details.medicalInfo.conditions?.length > 0 && (
                      <div>
                        <p className="text-sm font-medium text-gray-700">Medical Conditions:</p>
                        <ul className="list-disc list-inside text-sm text-gray-600 ml-2">
                          {details.medicalInfo.conditions.map((condition, index) => (
                            <li key={index}>{condition}</li>
                          ))}
                        </ul>
                      </div>
                    )}
                    {details.medicalInfo.allergies?.length > 0 && (
                      <div>
                        <p className="text-sm font-medium text-gray-700">Allergies:</p>
                        <ul className="list-disc list-inside text-sm text-gray-600 ml-2">
                          {details.medicalInfo.allergies.map((allergy, index) => (
                            <li key={index}>{allergy}</li>
                          ))}
                        </ul>
                      </div>
                    )}
                  </div>
                ) : (
                  <div className="bg-gray-50 rounded-lg p-3">
                    <div className="flex items-center">
                      <AlertCircle className="w-5 h-5 text-amber-500 mr-2" />
                      <p className="text-sm text-gray-500">No medical information added</p>
                    </div>
                  </div>
                )}
              </div>
            </div>
          )}

          {/* Footer Actions */}
          <div className="p-4 border-t space-y-2">
            <button 
              onClick={onEdit}
              className="w-full px-4 py-2 bg-indigo-600 text-white rounded-lg hover:bg-indigo-700"
            >
              Edit Member
            </button>
            <button className="w-full px-4 py-2 border border-gray-300 text-gray-700 rounded-lg hover:bg-gray-50">
              View Full Profile
            </button>
          </div>
        </div>
      </div>

      {/* Modals */}
      <Modal
        isOpen={showEmergencyContactModal}
        onClose={() => setShowEmergencyContactModal(false)}
        title="Add Emergency Contact"
      >
        <EmergencyContactForm
          memberId={member.id}
          onSuccess={() => {
            setShowEmergencyContactModal(false);
            loadMemberDetails();
          }}
          onCancel={() => setShowEmergencyContactModal(false)}
        />
      </Modal>

      <Modal
        isOpen={showMedicalInfoModal}
        onClose={() => setShowMedicalInfoModal(false)}
        title="Add Medical Information"
      >
        <MedicalInfoForm
          memberId={member.id}
          onSuccess={() => {
            setShowMedicalInfoModal(false);
            loadMemberDetails();
          }}
          onCancel={() => setShowMedicalInfoModal(false)}
        />
      </Modal>
    </>
  );
}