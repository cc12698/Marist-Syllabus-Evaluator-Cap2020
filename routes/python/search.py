import sys
import re

textFile = "./exampleText.txt"

keywords = {    #list of regex commands ment to seach for items
                "courseDes":      [] ,
                "courseObj":      [] ,
                "courseCred":     [] ,
                "preReq":         [] ,
                "gradeDet":       [] ,
                "otherpolicies":  [] ,
                "instrName":      [] ,
                "instrContact":   [] ,
                "democonsistant": [] , # not sure if this can be checked with keywords
                "assesMethod":    [] ,
                "rubrics":        [] , # may be missing
                "biblio":         [] ,
                "assignments":    [] ,
                "taskCrit":       [] ,
                "courseNum":      ["[0-9]{3}( )*(N|L|n|l)( )*[0-9]{3}" , "course()*number"] ,
                "format":         [] ,
                "attenPol":       [] ,
                "reqRead":        [] ,
                "courseDes":      [] ,
                "acadHonest":     [] ,
                "teachAct":       [] ,
                "accommod":       [] ,
                "courseDes":      [] ,
                "diversity":      [] , # not technically req
            }

found = {   #list of regex commands ment to seach for items
            "courseDes":      [] ,
            "courseObj":      [] ,
            "courseCred":     [] ,
            "preReq":         [] ,
            "gradeDet":       [] ,
            "otherpolicies":  [] ,
            "instrName":      [] ,
            "instrContact":   [] ,
            "democonsistant": [] , # not sure if this can be checked with keywords
            "assesMethod":    [] ,
            "rubrics":        [] , # may be missing
            "biblio":         [] ,
            "assignments":    [] ,
            "taskCrit":       [] ,
            "courseNum":      [] ,
            "format":         [] ,
            "attenPol":       [] ,
            "reqRead":        [] ,
            "courseDes":      [] ,
            "acadHonest":     [] ,
            "teachAct":       [] ,
            "accommod":       [] ,
            "courseDes":      [] ,
            "diversity":      [] , # not technically req
        }

def checkFile()
    found = len(cars)

    f = open(textFile , "r")
    for i in keywords:
        for line in f:
            if keywords[i] in line
                found[i] = line

    return found
