import { useEffect, useState } from 'react'
import { Button, Input, Label } from '../components/ui'
import { cn } from '../lib/utils'
import { changePasswordApi, getUserApi, updateUserApi } from '../api/user.api'
import { useQuery, useQueryClient } from '@tanstack/react-query'
import { useAuth } from '../contexts/AuthContext'

export default function UserPage() {
    const { user, refreshUser } = useAuth()
    const id = user?.id
    const queryClient = useQueryClient()

    const { data = {} } = useQuery({ queryKey: ['user', id], queryFn: () => getUserApi(id), enabled: !!id })
    const [userData, setUserData] = useState(data)
    const [isEditing, setIsEditing] = useState(false)
    const [isChangingPassword, setIsChangingPassword] = useState(false)

    const handleSave = async () => {
        try {
            const response = await updateUserApi(userData)
            console.log('response', response);
            if (response.id) {
                queryClient.invalidateQueries({ queryKey: ['user', id] })
                refreshUser(response)
                alert("Profile updated successfully")
            } else {
                alert("Failed to update profile")
            }
        } catch (error) {
            console.error(error)
            alert("Failed to update profile")
        }
    }

    useEffect(() => {
        if (data?.id) {
            // eslint-disable-next-line react-hooks/set-state-in-effect
            setUserData(data)
        }
    }, [data])

    return (
        <div className="relative min-h-screen">
            <div className="absolute top-1/3 left-1/2 transform -translate-x-1/2 -translate-y-1/2">
                <div className="mx-auto flex w-full flex-col justify-center space-y-6 sm:w-[350px]">
                    {isChangingPassword ? null : (
                        <div className="flex flex-col space-y-2 text-center">
                            <h1 className="text-2xl font-semibold tracking-tight">
                                {isEditing
                                    ? 'Edit Profile'
                                    : 'Your Profile'}
                            </h1>
                            <p className="text-sm text-muted-foreground">
                                {isEditing
                                    ? 'Update your account information'
                                    : 'View and manage your account details'}
                            </p>
                        </div>
                    )}
                    <div className={cn('grid gap-2')}>
                        {isChangingPassword ? (
                            <ChangePassword
                                userId={id}
                                onClose={() => setIsChangingPassword(false)}
                            />
                        ) : isEditing ? (
                            <form onSubmit={handleSave}>
                                <div className="grid gap-4">
                                    <div className="grid gap-2">
                                        <Label htmlFor="fullName">Full Name</Label>
                                        <Input
                                            id="fullName"
                                            placeholder="John Doe"
                                            type="text"
                                            autoCapitalize="words"
                                            value={userData.fullName}
                                            onChange={(e) =>
                                                setUserData({ ...userData, fullName: e.target.value })
                                            }
                                        />
                                    </div>
                                    <div className="grid gap-2">
                                        <Label htmlFor="email">Email</Label>
                                        <Input
                                            id="email"
                                            placeholder="name@example.com"
                                            type="email"
                                            autoCapitalize="none"
                                            value={userData.email}
                                            onChange={(e) =>
                                                setUserData({ ...userData, email: e.target.value })
                                            }
                                        />
                                    </div>
                                    <div className="grid gap-2">
                                        <Label htmlFor="username">Username</Label>
                                        <Input
                                            id="username"
                                            placeholder="username"
                                            type="text"
                                            autoCapitalize="none"
                                            value={userData.username}
                                            onChange={(e) =>
                                                setUserData({ ...userData, username: e.target.value })
                                            }
                                        />
                                    </div>
                                    <div className="grid grid-cols-2 gap-2">
                                        <Button type="submit" className="cursor-pointer">
                                            Save
                                        </Button>
                                        <Button
                                            type="button"
                                            variant="outline"
                                            className="cursor-pointer bg-transparent"
                                            onClick={() => setIsEditing(false)}
                                        >
                                            Cancel
                                        </Button>
                                    </div>
                                </div>
                            </form>
                        ) : (
                            <div>
                                <div className="grid gap-4">
                                    <div className="grid gap-2">
                                        <Label className="text-xs text-muted-foreground">
                                            Full Name
                                        </Label>
                                        <p className="text-sm font-medium">{userData.fullName}</p>
                                    </div>
                                    <div className="grid gap-2">
                                        <Label className="text-xs text-muted-foreground">
                                            Email
                                        </Label>
                                        <p className="text-sm font-medium">{userData.email}</p>
                                    </div>
                                    <div className="grid gap-2">
                                        <Label className="text-xs text-muted-foreground">
                                            Username
                                        </Label>
                                        <p className="text-sm font-medium">{userData.username}</p>
                                    </div>
                                    <div className="grid grid-cols-2 gap-2 pt-2">
                                        <Button
                                            type="button"
                                            className="cursor-pointer"
                                            onClick={() => setIsEditing(true)}
                                        >
                                            Edit
                                        </Button>
                                        <Button
                                            type="button"
                                            variant="outline"
                                            className="cursor-pointer bg-transparent"
                                            onClick={() => setIsChangingPassword(true)}
                                        >
                                            Change Password
                                        </Button>
                                    </div>
                                </div>
                            </div>
                        )}


                    </div>
                </div>
            </div>
        </div>
    )
}

function ChangePassword({ onClose, userId }) {
    const [oldPassword, setOldPassword] = useState('')
    const [newPassword, setNewPassword] = useState('')
    const [confirmPassword, setConfirmPassword] = useState('')
    const [error, setError] = useState('')

    const handleSubmit = async (e) => {
        e.preventDefault()
        setError('')

        if (!oldPassword || !newPassword || !confirmPassword) {
            setError('All fields are required')
            return
        }

        if (newPassword !== confirmPassword) {
            setError('New password and confirmation do not match')
            return
        }

        try {
            const payload = {
                id: Number(userId),
                oldPass: oldPassword,
                newPass: newPassword,
                confirmPass: confirmPassword,
            }
            const response = await changePasswordApi(payload)
            if (response) {
                alert("Password changed successfully")
                setOldPassword('')
                setNewPassword('')
                setConfirmPassword('')
                onClose?.()
            } else {
                alert("Failed to change password")
            }
        } catch (error) {
            console.error(error)
            alert("Failed to change password")
        }
    }

    return (
        <div>
            <div className="flex flex-col space-y-2 text-center mb-6">
                <h2 className="text-xl font-semibold tracking-tight">Change Password</h2>
                <p className="text-sm text-muted-foreground">
                    Enter your current password and choose a new one
                </p>
            </div>

            <form onSubmit={handleSubmit}>
                <div className="grid gap-4">
                    <div className="grid gap-2">
                        <Label htmlFor="oldPassword">Current Password</Label>
                        <Input
                            id="oldPassword"
                            placeholder="Enter current password"
                            type="password"
                            autoCapitalize="none"
                            value={oldPassword}
                            onChange={(e) => setOldPassword(e.target.value)}
                        />
                    </div>

                    <div className="grid gap-2">
                        <Label htmlFor="newPassword">New Password</Label>
                        <Input
                            id="newPassword"
                            placeholder="Enter new password"
                            type="password"
                            autoCapitalize="none"
                            value={newPassword}
                            onChange={(e) => setNewPassword(e.target.value)}
                        />
                    </div>

                    <div className="grid gap-2">
                        <Label htmlFor="confirmPassword">Confirm New Password</Label>
                        <Input
                            id="confirmPassword"
                            placeholder="Confirm new password"
                            type="password"
                            autoCapitalize="none"
                            value={confirmPassword}
                            onChange={(e) => setConfirmPassword(e.target.value)}
                        />
                    </div>

                    {error && (
                        <div className="rounded-md bg-destructive/10 p-2 text-sm text-destructive">
                            {error}
                        </div>
                    )}

                    <div className="grid grid-cols-2 gap-2 pt-2">
                        <Button type="submit" className="cursor-pointer">
                            Save
                        </Button>
                        <Button
                            type="button"
                            variant="outline"
                            className="cursor-pointer bg-transparent"
                            onClick={onClose}
                        >
                            Cancel
                        </Button>
                    </div>
                </div>
            </form>
        </div>
    )
}

